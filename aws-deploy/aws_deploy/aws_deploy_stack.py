from aws_cdk import (
    Stack,
    aws_lambda as _lambda,
    aws_apigateway as apigw,
    Duration,
    aws_ec2 as ec2,
    aws_rds as rds,
    aws_secretsmanager as secretsmanager,
    RemovalPolicy,
    CfnOutput
)
from constructs import Construct

class AwsDeployStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)


        cart_service_vpc = ec2.Vpc(
            self, "CartServiceVpc",
            ip_addresses= ec2.IpAddresses.cidr("10.0.0.0/16"),
            max_azs= 2,
            subnet_configuration=[
                ec2.SubnetConfiguration(
                    name="CartServiceRdsSub", cidr_mask=24, subnet_type=ec2.SubnetType.PRIVATE_ISOLATED
                ),
                ec2.SubnetConfiguration(
                    name="CartServiceLmbdaSub", cidr_mask=24, subnet_type=ec2.SubnetType.PUBLIC
                ),
            ]
        )

        cart_service_rds_sg = ec2.SecurityGroup(self, "CartServiceRdsSg", vpc=cart_service_vpc, allow_all_outbound=True)
        cart_service_function_sg = ec2.SecurityGroup(self, "CartServiceLambdaTest", vpc=cart_service_vpc, allow_all_outbound=True)

        cart_service_function = _lambda.Function(
            self,
            "CartServiceNestServerHandler",
            function_name="CartServiceFunction",
            runtime = _lambda.Runtime.NODEJS_20_X,
            code = _lambda.Code.from_asset("../dist"),
            handler = "main.handler", 
            memory_size = 1024,
            timeout=Duration.seconds(30)
        )

        apigw.LambdaRestApi(
            self, 'CartServiceApi',
            handler=cart_service_function,
            proxy=True,
            default_cors_preflight_options={
                "allow_origins": apigw.Cors.ALL_ORIGINS,
                "allow_methods": apigw.Cors.ALL_METHODS,
                "allow_headers": apigw.Cors.DEFAULT_HEADERS
            }
        )

        rds_secret_username = "test"
        
        rds_secret = secretsmanager.Secret(self, "CartServiceRdsSecret",
            secret_name="CartServiceRdsSecret",
            generate_secret_string=secretsmanager.SecretStringGenerator(
                secret_string_template = f'{{"username":"{rds_secret_username}"}}',
                generate_string_key='password',
                exclude_characters="/@\""
            )
        )
        rds_credentials = rds.Credentials.from_secret(rds_secret)
        cart_service_rds = rds.DatabaseInstance(
            self, 
            "CartServiceRds",
            database_name="CartDatabase",
            engine= rds.DatabaseInstanceEngine.POSTGRES,
            vpc= cart_service_vpc,
            vpc_subnets= ec2.SubnetSelection(
                subnet_type= ec2.SubnetType.PUBLIC,
            ),
            credentials= rds_credentials,
            security_groups=[cart_service_rds_sg],
            instance_type= ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
            port= 5432,
            allocated_storage= 80,
            multi_az= False,
            removal_policy= RemovalPolicy.DESTROY,
            publicly_accessible= True
        )

        cart_service_rds.connections.allow_from_any_ipv4(
            ec2.Port.tcp(5432),
            description= "Open port for connection"
        )

        CfnOutput(self, "CartServiceRdsEndpointAddress", value= cart_service_rds.db_instance_endpoint_address)
        CfnOutput(self, "CartServiceRdsSecretArn", value=rds_secret.secret_arn)
