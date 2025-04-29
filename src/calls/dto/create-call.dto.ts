export class CreateCallDto {
  readonly caller_number: string;
  readonly receiver_number: string;
  readonly start_time: string;
  readonly end_time: string;
  readonly status: string;
  readonly agent_id: string;
  readonly category: string;
  readonly priority: number;
}
