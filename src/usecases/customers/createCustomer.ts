import { Inject, Injectable } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import { CreateCustomerBodyDTO } from 'src/dto/customers/createCustomerBodyDTO'
import { CustomerRepository } from 'src/repositories/customers'

@Injectable()
export class CreateCustomerUsecase {
  @Inject()
  private readonly customers: CustomerRepository

  run(data: CreateCustomerBodyDTO) {
    return this.customers.add({ id: randomUUID(), ...data })
  }
}
