import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/createTask.dto';
import { GetTaskFilter } from './dto/getTaskFilter.dto';
import { UpdateTaskStatusDto } from './dto/updateTaskStatus.dto';
import { Task } from './task.entity';
import { GetUser } from 'src/auth/getUser.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query() filterDto: GetTaskFilter,
    @GetUser() user: User,
  ): Promise<Task[]> {
    return this.tasksService.getTasks(filterDto, user);
  }

  @Get('/:taskId')
  getTaskById(
    @Param('taskId') taskId: string,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.getTaskById(taskId, user);
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Patch('/:taskId/status')
  async updateTaskStatus(
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @Param('taskId') taskId: string,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(
      taskId,
      updateTaskStatusDto,
      user,
    );
  }

  @Delete('/:taskId')
  deleteTaskById(
    @Param('taskId') taskId: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.tasksService.deleteTask(taskId, user);
  }
}
