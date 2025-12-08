import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedImage = localStorage.getItem("image");
        const storedName = localStorage.getItem("name");
        return {
            image: storedImage || null,
            name: storedName || null,
        };
    });

    const login = (userData) => {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("nickname", userData.nickname);
        localStorage.setItem("name", userData.name);
        localStorage.setItem("role", userData.rolePath);
        localStorage.setItem("image", userData.image);

        setUser({
            image: userData.image,
            name: userData.name
        });
    };

    const updateProfileImage = (newImageUrl) => {
        setUser(prev => ({ ...prev, image: newImageUrl }));
        localStorage.setItem("image", newImageUrl);
    };

    return (
        <AuthContext.Provider value={{ user, login, updateProfileImage }}>
            {children}
        </AuthContext.Provider>
    );
};