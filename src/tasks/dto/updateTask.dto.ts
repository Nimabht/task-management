import { TaskStatus } from '../taskStatus.enum';

export class UpdateTaskDto {
  title: string;
  description: string;
  status: TaskStatus;
}
