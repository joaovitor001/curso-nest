import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.respository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto, user);
  }

  //  getAllTasks(): Task[] {
  //    return this.tasks;
  //  }
  //  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
  //    const { status, search } = filterDto;
  //    let tasks = this.getAllTasks();
  //    if (status) {
  //      tasks = tasks.filter((task) => task.status === status);
  //    }
  //   if (search) {
  //      tasks = tasks.filter((task) => {
  //       if (task.title.includes(search) || task.description.includes(search)) {
  //          return true;
  //        }
  //        return false;
  //      });
  //    }
  //    return tasks;
  //  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOne({ where: { id, user } });

    if (!found) {
      throw new NotFoundException(`Task with ID  not found`);
    }
    return found;
  }

  //  getTaskById(id: string): Task {
  //    const found = this.tasks.find((task) => task.id === id);
  //    if (!found) {
  //      throw new NotFoundException(`Task with ID  not found`);
  //    }
  //    return found;
  //  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  //  createTask(createTaskDto: CreateTaskDto): Task {
  //    const { title, description } = createTaskDto;
  //    const task: Task = {
  //      id: uuid(),
  //      title,
  //      description,
  //      status: TaskStatus.OPEN,
  //    };
  //    this.tasks.push(task);
  //    return task;
  //  }
  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({ id, user });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID not found`);
    }
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);

    task.status = status;
    await this.tasksRepository.save(task);

    return task;
  }
}
