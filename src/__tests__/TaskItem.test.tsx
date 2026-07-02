import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TaskItem } from '../components/TaskItem';
import type { Task } from '../types/task';

const mockTask: Task = {
	id: 1,
	title: 'My Task',
	description: 'My Description',
	completed: false,
	createdAt: '2026-01-15T10:00:00Z',
	updatedAt: '2026-01-15T10:00:00Z',
};

describe('TaskItem', () => {
	it('renders the task title and description', () => {
		render(
			<TaskItem task={mockTask} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />
		);
		expect(screen.getByText('My Task')).toBeInTheDocument();
		expect(screen.getByText('My Description')).toBeInTheDocument();
	});

	it('calls onToggle when the checkbox is clicked', async () => {
		const user = userEvent.setup();
		const onToggle = vi.fn();
		render(
			<TaskItem task={mockTask} onToggle={onToggle} onDelete={vi.fn()} onEdit={vi.fn()} />
		);

		await user.click(screen.getByRole('checkbox'));

		expect(onToggle).toHaveBeenCalledWith(1);
	});

	it('requires a second click to confirm delete', async () => {
		const user = userEvent.setup();
		const onDelete = vi.fn();
		render(
			<TaskItem task={mockTask} onToggle={vi.fn()} onDelete={onDelete} onEdit={vi.fn()} />
		);

		const deleteButton = screen.getByLabelText('Supprimer');
		await user.click(deleteButton);
		expect(onDelete).not.toHaveBeenCalled();

		await user.click(deleteButton);
		expect(onDelete).toHaveBeenCalledWith(1);
	});

	it('enters edit mode and saves changes', async () => {
		const user = userEvent.setup();
		const onEdit = vi.fn();
		render(
			<TaskItem task={mockTask} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={onEdit} />
		);

		await user.click(screen.getByLabelText('Modifier'));

		const titleInput = screen.getByLabelText('Modifier le titre');
		await user.clear(titleInput);
		await user.type(titleInput, 'Updated Title');
		await user.click(screen.getByText('Enregistrer'));

		expect(onEdit).toHaveBeenCalledWith(1, {
			title: 'Updated Title',
			description: 'My Description',
		});
	});

	it('cancels edit mode without saving', async () => {
		const user = userEvent.setup();
		const onEdit = vi.fn();
		render(
			<TaskItem task={mockTask} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={onEdit} />
		);

		await user.click(screen.getByLabelText('Modifier'));
		const titleInput = screen.getByLabelText('Modifier le titre');
		await user.clear(titleInput);
		await user.type(titleInput, 'Should not save');
		await user.click(screen.getByText('Annuler'));

		expect(onEdit).not.toHaveBeenCalled();
		expect(screen.getByText('My Task')).toBeInTheDocument();
	});
});
