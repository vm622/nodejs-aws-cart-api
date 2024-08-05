import aws_cdk as core
import aws_cdk.assertions as assertions

from aws_deploy.aws_deploy_stack import AwsDeployStack

# example tests. To run these tests, uncomment this file along with the example
# resource in aws_deploy/aws_deploy_stack.py
def test_sqs_queue_created():
    app = core.App()
    stack = AwsDeployStack(app, "aws-deploy")
    template = assertions.Template.from_stack(stack)

#     template.has_resource_properties("AWS::SQS::Queue", {
#         "VisibilityTimeout": 300
#     })
