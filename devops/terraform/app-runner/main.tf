resource "aws_apprunner_service" "customers-api-demo" {
  service_name = var.service_name

  source_configuration {
    image_repository {
      image_configuration {
        port = "80"
        runtime_environment_variables {
          AUTH_INTROSPECTION_URL = var.AUTH_INTROSPECTION_URL
        }
        runtime_environment_secrets {
          AUTH_CLIENT_ID     = var.AUTH_CLIENT_ID
          AUTH_CLIENT_SECRET = var.AUTH_CLIENT_SECRET
        }
      }
      image_identifier      = var.image
      image_repository_type = "ECR"
    }
    auto_deployments_enabled = true
  }

  instance_configuration {
    cpu    = "0.25"
    memory = "0.5"
  }

  tags = {
    Name = var.service_name
  }
}
