import { TaskStatus } from '../taskStatus.enum';
import { IsEnum } from 'class-validator';
export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
