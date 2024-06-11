import { ReactNode } from 'react';

type LayoutProps = {
    children: ReactNode;
};

const AuthLayout = ({ children }: LayoutProps) => {
    return (
        <main className="w-full">
            {children}
        </main>
    );
};

export default AuthLayout;
``
