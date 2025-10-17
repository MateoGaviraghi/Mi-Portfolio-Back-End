import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';

type Constructor<T = unknown> = new (...args: unknown[]) => T;

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(
    value: unknown,
    { metatype }: ArgumentMetadata,
  ): Promise<unknown> {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const object = plainToInstance(metatype, value as object);
    const errors: ValidationError[] = await validate(object as object);
    if (errors.length > 0) {
      const messages = errors.map((err) => {
        const constraints = err.constraints || {};
        return `${err.property} - ${Object.values(constraints).join(', ')}`;
      });
      throw new BadRequestException({
        message: 'Validation failed',
        errors: messages,
      });
    }
    return value;
  }

  private toValidate(metatype: Constructor): boolean {
    const types: Constructor[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
