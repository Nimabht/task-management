import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/createTask.dto';
import { UpdateTaskDto } from './dto/updateTask.dto';
import { GetTaskFilter } from './dto/get-task-filter.dto';
@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskWithFilters(filterDto: GetTaskFilter): Task[] {
    const { status, search } = filterDto;
    let filteredTasks = this.tasks;

    if (!!status)
      filteredTasks = filteredTasks.filter((task) => task.status === status);

    if (!!search)
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.description.toLowerCase().includes(search.toLowerCase()),
      );

    return filteredTasks;
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) throw new NotFoundException(`Task with ID "${id}" not found.`);
    return task;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }

  // updateTask(id: string, updateTaskDto: UpdateTaskDto): Task {
  //   const { title, description, status } = updateTaskDto;
  //   const taskIndex = this.tasks.findIndex((task) => {
  //     return task.id == id;
  //   });

  //   this.tasks[taskIndex].title = title;
  //   this.tasks[taskIndex].description = description;
  //   this.tasks[taskIndex].status = status;

  //   return this.tasks[taskIndex];
  // }

  updateTaskStatus(task: Task, status: TaskStatus) {
    task.status = status;
    return task;
  }

  deleteTask(id: string): void {
    const existingTask = this.getTaskById(id);
    this.tasks = this.tasks.filter((task) => {
      task.id != existingTask.id;
    });
  }
}
