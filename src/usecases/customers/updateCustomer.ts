import { Inject, Injectable } from '@nestjs/common'
import { UpdateCustomerBodyDTO } from 'src/dto/customers/updateCustomerBodyDTO'
import { CustomerRepository } from 'src/repositories/customers'

@Injectable()
export class UpdateCustomerUsecase {
  @Inject()
  private readonly customers: CustomerRepository

  run(data: UpdateCustomerBodyDTO) {
    const { id, ...rest } = data
    return this.customers.update(id, rest)
  }
}
