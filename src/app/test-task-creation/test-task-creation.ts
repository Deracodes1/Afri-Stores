import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-test-task-creation',
  imports: [FormsModule],
  templateUrl: './test-task-creation.html',
  styleUrl: './test-task-creation.css',
})
export class TestTaskCreation {
  taskName = '';
  taskDescription = '';
  createTask() {
    const taskDto = {
      taskName: this.taskName,
      taskDesc: this.taskDescription,
    };
    console.log(
      `task created successfully, the task title for today is "${taskDto.taskName.toUpperCase()}".  the full details: ${taskDto.taskDesc}`,
    );
  }
}
