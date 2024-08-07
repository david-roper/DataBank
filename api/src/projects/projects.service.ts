import type { DatasetInfo } from '@databank/types';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@/core/decorators/inject-prisma-client.decorator';
import { DatasetsService } from '@/datasets/datasets.service';
import type { Model } from '@/prisma/prisma.types';
import { UsersService } from '@/users/users.service';

import type { CreateProjectDto, ProjectDatasetDto, UpdateProjectDto } from './zod/projects';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel('Project') private readonly projectModel: Model<'Project'>,
    private readonly usersService: UsersService,
    private readonly datasetService: DatasetsService
  ) {}

  async addDataset(currentUserId: string, projectId: string, projectDatasetDto: ProjectDatasetDto) {
    if (!(await this.isProjectManager(currentUserId, projectId))) {
      throw new ForbiddenException('Only project managers can add new dataset!');
    }

    const project = await this.getProjectById(currentUserId, projectId);

    if (!project) {
      throw new NotFoundException('Project Not Found!');
    }

    const projectDatasets = project.datasets;
    projectDatasets.push(projectDatasetDto);
    return await this.updateProject(currentUserId, projectId, {
      datasets: projectDatasets
    });
  }

  async addUser(currentUserId: string, projectId: string, newUserId: string) {
    if (!(await this.isProjectManager(currentUserId, projectId))) {
      throw new ForbiddenException('Only project managers can add new users!');
    }

    const project = await this.getProjectById(currentUserId, projectId);

    if (!project) {
      throw new NotFoundException('Project Not Found!');
    }

    const userIdsArray = project.userIds;
    userIdsArray.push(newUserId);

    return await this.updateProject(currentUserId, projectId, {
      userIds: userIdsArray
    });
  }

  async createProject(currentUserId: string, createProjectDto: CreateProjectDto) {
    if (!(await this.usersService.isOwnerOfDatasets(currentUserId))) {
      throw new ForbiddenException('Only dataset owners can create project!');
    }

    if (!createProjectDto.userIds.includes(currentUserId)) {
      throw new ForbiddenException('Creator of the project must be a user of the project!');
    }

    return await this.projectModel.create({
      data: createProjectDto
    });
  }

  async deleteProject(currentUserId: string, projectId: string) {
    if (!(await this.isProjectManager(currentUserId, projectId))) {
      throw new ForbiddenException('The current user has no right to delete this project!');
    }

    const deletedProject = await this.projectModel.delete({
      where: {
        id: projectId
      }
    });

    return deletedProject;
  }

  async getAllProjects(currentUserId: string) {
    return await this.projectModel.findMany({
      where: {
        userIds: {
          has: currentUserId
        }
      }
    });
  }

  async getProjectById(currentUserId: string, projectId: string) {
    const project = await this.projectModel.findUnique({
      where: {
        id: projectId,
        userIds: {
          has: currentUserId
        }
      }
    });

    if (!project) {
      throw new NotFoundException(`Cannot find project with id ${projectId} for
        user with id ${currentUserId}`);
    }

    return project;
  }

  async getProjectDatasets(projectId: string) {
    const project = await this.projectModel.findUnique({
      where: {
        id: projectId
      }
    });
    if (!project) {
      throw new NotFoundException(`Project with id ${projectId} cannot be found`);
    }

    const projectDatasetsInfo: DatasetInfo[] = [];
    for (let projectDataset of project.datasets) {
      const projectDatasetInfo = await this.datasetService.getById(projectDataset.datasetId);
      if (!projectDatasetInfo) {
        throw new NotFoundException('Project dataset Information NOT found!');
      }

      projectDatasetsInfo.push(projectDatasetInfo);
    }

    return projectDatasetsInfo;
  }

  async removeDataset(currentUserId: string, projectId: string, datasetId: string) {
    if (!(await this.isProjectManager(currentUserId, projectId))) {
      throw new ForbiddenException('Only project managers can remove dataset!');
    }

    const project = await this.getProjectById(currentUserId, projectId);

    const newProjectDatasets = project.datasets.filter((x) => x.datasetId !== datasetId);

    return await this.updateProject(currentUserId, projectId, { datasets: newProjectDatasets });
  }

  async removeUser(currentUserId: string, projectId: string, userIdToRemove: string) {
    if (!(await this.isProjectManager(currentUserId, projectId))) {
      throw new ForbiddenException('Only project managers can remove users!');
    }

    const project = await this.getProjectById(currentUserId, projectId);

    if (!project) {
      throw new NotFoundException('Project Not Found!');
    }

    const userIdsArray = project.userIds;
    const newUserIdsArray = userIdsArray.filter((x) => x !== userIdToRemove);

    return await this.updateProject(currentUserId, projectId, {
      userIds: newUserIdsArray
    });
  }

  async updateProject(currentUserId: string, projectId: string, updateProjectDto: UpdateProjectDto) {
    const isProjectManager = await this.isProjectManager(currentUserId, projectId);
    if (!isProjectManager) {
      throw new ForbiddenException('The current user has no right to manipulate this project!');
    }

    const updateProject = await this.projectModel.update({
      data: updateProjectDto,
      where: {
        id: projectId
      }
    });
    return updateProject;
  }

  private async isProjectManager(currentUserId: string, projectId: string) {
    const user = await this.usersService.findById(currentUserId);
    const project = await this.getProjectById(currentUserId, projectId);

    const datasetIdSet = new Set();
    for (let curr_datasetId of user.datasetId) {
      datasetIdSet.add(curr_datasetId);
    }

    for (let dataset of project.datasets) {
      if (datasetIdSet.has(dataset.datasetId)) {
        return true;
      }
    }

    return false;
  }
}
