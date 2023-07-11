import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/createTask.dto';
import { UpdateTaskDto } from './dto/updateTask.dto';
import { GetTaskFilter } from './dto/getTaskFilter.dto';
import { UpdateTaskStatusDto } from './dto/updateTaskStatus.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getTasks(@Query() filterDto: GetTaskFilter): Task[] {
    if (!!Object.keys(filterDto).length) {
      return this.tasksService.getTaskWithFilters(filterDto);
    } else {
      return this.tasksService.getAllTasks();
    }
  }

  @Get('/:taskId')
  getTaskById(@Param('taskId') taskId: string): Task {
    return this.tasksService.getTaskById(taskId);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto);
  }

  @Patch('/:taskId/status')
  updateTaskStatus(
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @Param('taskId') taskId: string,
  ): Task {
    const task = this.tasksService.getTaskById(taskId);
    return this.tasksService.updateTaskStatus(task, updateTaskStatusDto);
  }

  @Delete('/:taskId')
  deleteTaskById(@Param('taskId') taskId: string): void {
    this.tasksService.deleteTask(taskId);
  }
}
