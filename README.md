# javascript-raytracing
Basic raytracing engine using Javascript

## Step 1: Ray tracing
This step demonstrates the most bare-bones raytracing engine: Shoot a ray from each pixel on the canvas into the world, find where it lands, and set the pixel's color to the color of the point it hits. To find where it lands, we must traverse all of the objects in the world, and find the object which intersects the nearest.

## Step 2: Lighting 
At each point of intersection, we can trace a ray (shadow ray) to all the lights in  the world. If the path of the ray is unobstructed, then we contribute that light to the color of the pixel, proportional to the angle between the shadow ray and the surface normal (diffuse), and proportional to the difference of the shadow ray and the view vector to the normal (specular).

## Step 3: Camera controls 
In this step, we create a camera capable of perspective views and moving at different angles. Because we may render the image more than once, we also split up the displaying of the image and the rendering of the image (An MVC sort of practice) into two different threads.

## Step 4: Additional Geometry
So then how are objects represented? One of the simplest objects is the sphere, which was already implemented in step 1. With raytracing, all mathematical shapes can be represented at perfect resolution. This includes planes, which is the simplest for detecting collisions. We can then "draw" shapes on the plane to represent 2D objects, such as triangles. If the ray collides with the plane, and the point of intersection is inside the triangle or other geometric shape, the ray collides. With this, we can use the same meshes that we may have given to OpenGL to render.

## Step 5: Ray Bouncing
For each ray collision, we can shoot another ray out from that intersection point at a reflective angle from the normal. Each of these rays will calculate the light from shadow rays at the surfaces they hit, and will contribute to the color of the pixel. Each successive bounce will only contribute a fraction of the last bounce. We must also put a limit on the number of bounces allowed, or the ray may bounce forever.

## Step 6: Reflections
One of the fanciest parts of raytracing, but is actually very simple. Since the color contribution of each bouncing ray is normally reduced by some fraction, instead make it so that the bouncing ray accounts for the entire color.

## Step 7: Randomization
By shooting multiple rays out from a single pixel, we can get an antialiasing effect. These rays would shoot from random positions within the pixel's dimensions. Since we are shooting multiple rays per pixel, we can also afford to have the rays bounce in random ways, to reflect how diffuse lighting would actually act, and collect light from sources that would have been unseeable in past iterations. Much more computationally intense, but creates a much more realistic image.

## Step 8: Transparency
If we have time?
