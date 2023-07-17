resource "aws_iam_role" "app_runner_instance_role" {
  name = "${var.service_name}-instance-AppRunnerServiceRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          "Service" : "tasks.apprunner.amazonaws.com"
        }
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "app_runner_instance_role" {
  role       = aws_iam_role.app_runner_instance_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess"
}

resource "aws_iam_role" "app_runner_access_role" {
  name = "${var.service_name}-access-AppRunnerServiceRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "build.apprunner.amazonaws.com"
        }
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "app_runner_access_role" {
  role       = aws_iam_role.app_runner_access_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess"
}

resource "aws_apprunner_service" "customers-api-demo" {
  service_name = var.service_name

  source_configuration {
    image_repository {
      image_configuration {
        port = "80"
        runtime_environment_variables = {
          AUTH_INTROSPECTION_URL = var.AUTH_INTROSPECTION_URL
          AUTH_CLIENT_ID         = var.AUTH_CLIENT_ID
          AUTH_CLIENT_SECRET     = var.AUTH_CLIENT_SECRET
          REDIS_HOST             = var.REDIS_HOST
        }
      }
      image_identifier      = var.image
      image_repository_type = "ECR"
    }
    auto_deployments_enabled = false
    authentication_configuration {
      access_role_arn = aws_iam_role.app_runner_access_role.arn
    }
  }

  instance_configuration {
    cpu               = 256
    memory            = 512
    instance_role_arn = aws_iam_role.app_runner_instance_role.arn
  }

  tags = {
    Name = var.service_name
  }
}
