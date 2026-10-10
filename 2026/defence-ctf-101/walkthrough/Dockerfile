# Walkthrough site for the defence workshop. The slides are plain static
# files, so nginx is all it needs. They are baked into the image so the
# container works on its own; compose.dev.yaml bind-mounts them instead, for
# editing without rebuilds.
FROM nginx:1.28-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY site /usr/share/nginx/html

# File modes in the build context depend on who created the files (editors and
# tools often write 600), and nginx serves them as an unprivileged user
RUN chmod -R a+rX /usr/share/nginx/html
