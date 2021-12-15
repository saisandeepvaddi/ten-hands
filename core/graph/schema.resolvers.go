package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"math/rand"

	"github.com/saisandeepvaddi/ten-hands/core/graph/generated"
	"github.com/saisandeepvaddi/ten-hands/core/graph/model"
)

func (r *mutationResolver) CreateTask(ctx context.Context, input model.NewTask) (*model.Task, error) {
	task := &model.Task{
		ID:      fmt.Sprintf("%d", rand.Int()),
		Command: input.Command,
		Path:    input.Path,
		Pid:     -1,
		Running: false,
	}
	r.tasks = append(r.tasks, task)
	return task, nil
}

func (r *queryResolver) Tasks(ctx context.Context) ([]*model.Task, error) {
	return r.tasks, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
