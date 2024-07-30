import boto3
import json
import sys

def get_secret_credentials(secret_arn):
    client = boto3.client('secretsmanager')
    response = client.get_secret_value(SecretId=secret_arn)
    secret = json.loads(response['SecretString'])
    return secret['username'], secret['password'], secret['dbname'], secret['host']


username, password, database, endpoint = get_secret_credentials(sys.argv[1])
print(f"{endpoint=}\n{database=}\n{username=}, {password=}")
