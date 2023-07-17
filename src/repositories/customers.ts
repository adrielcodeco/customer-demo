import { Inject, Injectable } from '@nestjs/common'
import { RedisClient, redisProviderKey } from 'src/infrastructure/redis.module'
import { Customer } from 'src/models/customer'

@Injectable()
export class CustomerRepository {
  @Inject(redisProviderKey)
  private readonly redis: RedisClient

  async add(customer: Customer) {
    await this.redis.set(`customer:${customer.id}`, JSON.stringify(customer))
    return customer
  }

  async find(id: string): Promise<Customer | undefined> {
    const customer = await this.redis.get(`customer:${id}`)
    if (!customer) {
      return undefined
    }
    return JSON.parse(customer)
  }

  async update(id: string, customer: Omit<Customer, 'id'>): Promise<Customer> {
    const exists = await this.redis.exists(`customer:${id}`)
    if (exists !== 1) {
      throw new Error(`Customer ${id} not found`)
    }
    const updated = { id, ...customer }
    await this.redis.set(`customer:${id}`, JSON.stringify(updated))
    return updated
  }
}
