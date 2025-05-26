import { CreateSessionInput } from './create-session.input';
declare const UpdateSessionInput_base: import("@nestjs/common").Type<Partial<CreateSessionInput>>;
export declare class UpdateSessionInput extends UpdateSessionInput_base {
    id: string;
    isActive?: boolean;
}
export {};
