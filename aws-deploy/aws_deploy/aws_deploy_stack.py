from aws_cdk import (
    Stack,
    aws_lambda as _lambda,
    aws_apigateway as apigw,
    Duration
)
from constructs import Construct

class AwsDeployStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

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
