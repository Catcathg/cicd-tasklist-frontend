import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TaskForm } from '../components/TaskForm';

describe('TaskForm', () => {
	it('renders the create form by default', () => {
		render(<TaskForm onSubmit={vi.fn()} />);
		expect(screen.getByText('Nouvelle tâche')).toBeInTheDocument();
		expect(screen.getByText('Ajouter')).toBeInTheDocument();
	});

	it('renders the edit form when mode is edit', () => {
		render(<TaskForm onSubmit={vi.fn()} mode="edit" initialValues={{ title: 'X' }} />);
		expect(screen.getByText('Modifier la tâche')).toBeInTheDocument();
		expect(screen.getByText('Modifier')).toBeInTheDocument();
	});

	it('shows a validation error when submitting an empty title', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn();
		render(<TaskForm onSubmit={onSubmit} />);

		await user.click(screen.getByText('Ajouter'));

		expect(screen.getByRole('alert')).toHaveTextContent('Le titre est requis');
		expect(onSubmit).not.toHaveBeenCalled();
	});

	it('calls onSubmit with trimmed values and resets the form in create mode', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn();
		render(<TaskForm onSubmit={onSubmit} />);

		await user.type(screen.getByLabelText('Titre'), '  My Task  ');
		await user.type(screen.getByLabelText('Description'), '  My Description  ');
		await user.click(screen.getByText('Ajouter'));

		expect(onSubmit).toHaveBeenCalledWith({
			title: 'My Task',
			description: 'My Description',
		});
		expect(screen.getByLabelText('Titre')).toHaveValue('');
	});

	it('calls onCancel when the cancel button is clicked', async () => {
		const user = userEvent.setup();
		const onCancel = vi.fn();
		render(<TaskForm onSubmit={vi.fn()} onCancel={onCancel} />);

		await user.click(screen.getByText('Annuler'));

		expect(onCancel).toHaveBeenCalled();
	});
});
