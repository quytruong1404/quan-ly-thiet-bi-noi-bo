# ==========================================
# DOCKERFILE FOR SPRING BOOT BACKEND
# ==========================================
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B || true

COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

ENV PORT=10000
EXPOSE 10000

ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-10000} -Dserver.address=0.0.0.0 -jar app.jar"]
