export class CreateCallDto {
  readonly caller_number: string;
  // @IsString()
  readonly receiver_number: string;
  // @IsString()
  readonly start_time: string;
  // @IsString()
  readonly end_time: string;
  // @IsString()
  readonly status: string;
  // @IsString()
  readonly agent_id: string;
  // @IsString()
  readonly category: string;
  // @IsNumber()
  readonly priority: number;
}
