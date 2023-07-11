import { TaskStatus } from '../taskStatus.enum';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class GetTaskFilter {
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
