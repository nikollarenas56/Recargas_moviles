import { IsNumber, IsString, Min, Max, Matches, Length } from 'class-validator';

export class CreateRechargeDto {
  @IsString()
  @Length(10, 10, { message: 'Phone number must be exactly 10 digits' })
  @Matches(/^3\d{9}$/, {
    message: 'Phone number must start with 3 and contain only 10 numeric digits',
  })
  phoneNumber: string;

  @IsNumber()
  @Min(1000, { message: 'Minimum amount is 1000' })
  @Max(100000, { message: 'Maximum amount is 100000' })
  amount: number;
}
