terraform {
  backend "s3" {
    bucket = "customers-api-demo-terraform-backend"
    key    = "customers-api-demo-ecs-state"
    region = "us-east-2"
  }
}
