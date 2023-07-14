import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './taskStatus.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/createTask.dto';
import { GetTaskFilter } from './dto/getTaskFilter.dto';
import { UpdateTaskStatusDto } from './dto/updateTaskStatus.dto';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  async getTasks(filterDto: GetTaskFilter, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.taskRepository.createQueryBuilder('task');

    query.where({ user });

    if (!!status) {
      query.andWhere('task.status = :status', { status });
    }

    if (!!search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        {
          search: `%${search}%`,
        },
      );
    }

    const filteredTasks = await query.getMany();
    return filteredTasks;
  }

  async getTaskById(taskId: string, user: User): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id: taskId });
    const isOwner = user.tasks.find((task) => task.id == taskId);

    if (!task || !isOwner)
      throw new NotFoundException(`Task with ID "${taskId}" not found.`);
    return task;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });
    await this.taskRepository.save(task);
    return task;
  }

  async updateTaskStatus(
    taskId: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
    user: User,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    const task = await this.getTaskById(taskId, user);
    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }

  async deleteTask(taskId: string, user: User): Promise<void> {
    const result = await this.taskRepository
      .createQueryBuilder()
      .delete()
      .from(Task)
      .where('id = :taskId AND user.id = :userId', { taskId, userId: user.id })
      .execute();

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${taskId}" not found.`);
    }
  }
}
