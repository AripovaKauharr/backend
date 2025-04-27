export class CreateCallDto {
  readonly caller_number: string;
  readonly receiver_number: string;
  readonly priority: number;
  readonly category: number;
}
