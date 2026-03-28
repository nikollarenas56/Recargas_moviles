import { IsString, IsNumber, Matches, Min, Max } from 'class-validator';

/**
 * DTO for creating a recharge.
 * Defines the input contract for the create recharge use case.
 */
export class CreateRechargeDto {
  @IsString()
  @Matches(/^3\d{9}$/, {
    message: 'Phone number must be 10 digits starting with 3',
  })
  phoneNumber: string;

  @IsNumber()
  @Min(1000, { message: 'Amount must be at least 1000' })
  @Max(100000, { message: 'Amount must be at most 100000' })
  amount: number;
}
