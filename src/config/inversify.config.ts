import { Container } from "inversify";
import { AuthController } from "../controllers/AuthController.js";
import { AuthRoutes } from "../routes/AuthRoutes.js";
import { SessionController } from "../controllers/SessionController.js";
import { SessionRepository } from "../repositories/SessionRepository.js";
import { SessionServices } from "../services/SessionService.js";
import { UserService } from "../services/UserService.js";
import { UserController } from "../controllers/UserController.js";
import { TYPES } from "../types/type.js";

const container: Container = new Container();
container.bind<AuthController>(TYPES.AuthController).to(AuthController);
container.bind<AuthRoutes>(TYPES.AuthRoutes).to(AuthRoutes);
container.bind<SessionController>(TYPES.SessionController).to(SessionController);
container.bind<SessionRepository>(TYPES.SessionRepository).to(SessionRepository);
container.bind<SessionServices>(TYPES.SessionServices).to(SessionServices);
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<UserController>(TYPES.UserController).to(UserController);


export { container };
