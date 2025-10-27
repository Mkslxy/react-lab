import React from "react";
import "./UserCard.css";

export interface User {
    firstName: string;
    lastName: string;
    gender: "male" | "female";
    age: number;
    position: string;
    photo: string;
    hobbies: string[];
}

const UserCard: React.FC<{ user: User }> = ({ user }) => {
    return (
        <div
            className="user-card"
            style={{
                backgroundColor: user.age > 30 ? "#e0f7fa" : "#fff3e0",
            }}
        >
            <img src={user.photo} alt="User" className="user-photo" />
            <h2>
                {user.firstName} {user.lastName}
            </h2>
            <p>Gender: {user.gender}</p>
            {user.age > 18 && <p>Age: {user.age}</p>}
            <p>Position: {user.position}</p>
            <h4>Hobbies:</h4>
            <ul>
                {user.hobbies.map((hobby, index) => (
                    <li key={index}>{hobby}</li>
                ))}
            </ul>
        </div>
    );
};

export default UserCard;
