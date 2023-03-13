import { randomUUID } from 'node:crypto'

import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'
import { validationTasksData } from './validation/tasks.js'

const database = new Database()

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      const error = validationTasksData({ title, description })

      if(error) {
        return res.writeHead(400).end(JSON.stringify({ message: error }))
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null
      }

      database.insert('tasks', task)

      return res.writeHead(201).end()
    }
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const tasks = database.select('tasks')

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      const error = validationTasksData({ title, description })

      if(error) {
        return res.writeHead(400).end(JSON.stringify({ message: error }))
      }

      const updated = database.update('tasks', id, { title, description })
      if (!updated) {
        return res.writeHead(404).end(JSON.stringify({ message: 'Task not found' }))
      }

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const updated = database.update('tasks', id, { completed_at: new Date() })
      if (!updated) {
        return res.writeHead(404).end(JSON.stringify({ message: 'Task not found' }))
      }

      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const deleted = database.delete('tasks', id)
      if (!deleted) {
        return res.writeHead(404).end(JSON.stringify({ message: 'Task not found' }))
      }

      return res.writeHead(204).end()
    }
  }

]