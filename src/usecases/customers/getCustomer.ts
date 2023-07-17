import { Inject, Injectable } from '@nestjs/common'
import { CustomerRepository } from 'src/repositories/customers'

@Injectable()
export class GetCustomerUsecase {
  @Inject()
  private readonly customers: CustomerRepository

  run(id: string) {
    return this.customers.find(id)
  }
}
