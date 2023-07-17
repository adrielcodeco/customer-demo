terraform {
  backend "s3" {
    bucket = "terraform-backend"
    key    = "customers-api-demo-ecs-state"
    region = "us-east-2"
  }
}
