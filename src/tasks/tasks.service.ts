import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './taskStatus.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/createTask.dto';
import { GetTaskFilter } from './dto/getTaskFilter.dto';
import { UpdateTaskStatusDto } from './dto/updateTaskStatus.dto';
import { Task } from './task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  async getAllTasks(): Promise<Task[]> {
    return await this.taskRepository.find();
  }

  async getTaskWithFilters(filterDto: GetTaskFilter): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.taskRepository.createQueryBuilder('task');

    if (!!status) {
      query.andWhere('task.status = :status', { status });
    }

    if (!!search) {
      query.andWhere(
        '(task.title ILIKE :search OR task.description ILIKE :search)',
        {
          search: `%${search}%`,
        },
      );
    }

    const filteredTasks = await query.getMany();
    return filteredTasks;
  }

  async getTaskById(taskId: string): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id: taskId });
    if (!task)
      throw new NotFoundException(`Task with ID "${taskId}" not found.`);
    return task;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });
    await this.taskRepository.save(task);
    return task;
  }

  async updateTaskStatus(
    taskId: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    const task = await this.getTaskById(taskId);
    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }

  async deleteTask(taskId: string): Promise<void> {
    const result = await this.taskRepository.delete(taskId);
    console.log(result);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${taskId}" not found.`);
    }
  }
}
