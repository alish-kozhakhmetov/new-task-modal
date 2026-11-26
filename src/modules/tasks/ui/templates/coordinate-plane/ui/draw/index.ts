import { createCoordinatePlaneTemplate } from '../../lib/create-coordinate-plane-template'

/**
 * Coordinate plane, answered on the plane: a point, several points, or a
 * figure by two points. Prototype for Alisher's review (26.11) — not in
 * `available-tasks` and not in the template registry until approved.
 */
export const CoordinatePlaneDraw = createCoordinatePlaneTemplate({
  id: 'coordinatePlane.draw',
})
