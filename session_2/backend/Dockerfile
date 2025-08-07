FROM openjdk:17-jdk-slim

WORKDIR /app

# Install Maven, curl, and entr for file watching
RUN apt-get update && apt-get install -y maven curl entr && rm -rf /var/lib/apt/lists/*

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Create src directory (will be mounted in development)
RUN mkdir -p src

# Expose port
EXPOSE 8080

# Run with hot reload using spring-boot:run with proper devtools configuration
CMD find src/main -type f -name '*.java' | entr -r mvn compile & mvn spring-boot:run -Dspring-boot.run.jvmArguments='-Dspring.devtools.restart.enabled=true -Dspring.devtools.restart.additional-paths=src/main -Dspring.devtools.livereload.enabled=true'