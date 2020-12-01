echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker build --build-arg version="$TRAVIS_TAG" -t chiich/pof:latest .
docker tag chiich/pof:latest chiich/pof:$TRAVIS_TAG
docker push "chiich/pof:latest" && docker push "chiich/pof:$TRAVIS_TAG"