import { TaskStatus } from '../task.model';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class GetTaskFilter {
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
