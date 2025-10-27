import React, { useState } from "react";
import UserCard, { User } from "./components/UserCard";

const usersData: User[] = [
  {
    firstName: "Alex",
    lastName: "Petrov",
    gender: "male",
    age: 25,
    position: "Frontend Developer",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    hobbies: ["Coding", "Football", "Gaming"],
  },
  {
    firstName: "Anna",
    lastName: "Koval",
    gender: "female",
    age: 19,
    position: "Designer",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    hobbies: ["Drawing", "Music", "Travel"],
  },
  {
    firstName: "Dmytro",
    lastName: "Shevchenko",
    gender: "male",
    age: 17,
    position: "Intern",
    photo: "https://randomuser.me/api/portraits/men/45.jpg",
    hobbies: ["Reading", "Cycling"],
  },
  {
    firstName: "Olena",
    lastName: "Bondar",
    gender: "female",
    age: 35,
    position: "Manager",
    photo: "https://randomuser.me/api/portraits/women/21.jpg",
    hobbies: ["Cooking", "Yoga", "Hiking"],
  },
  {
    firstName: "Serhii",
    lastName: "Ivanov",
    gender: "male",
    age: 42,
    position: "Backend Developer",
    photo: "https://randomuser.me/api/portraits/men/61.jpg",
    hobbies: ["Chess", "Fishing", "Coding"],
  },
  {
    firstName: "Kateryna",
    lastName: "Tkachenko",
    gender: "female",
    age: 28,
    position: "QA Engineer",
    photo: "https://randomuser.me/api/portraits/women/65.jpg",
    hobbies: ["Testing", "Dancing", "Cooking"],
  },
  {
    firstName: "Andrii",
    lastName: "Marchenko",
    gender: "male",
    age: 22,
    position: "DevOps",
    photo: "https://randomuser.me/api/portraits/men/75.jpg",
    hobbies: ["Running", "Gaming", "Automation"],
  },
  {
    firstName: "Iryna",
    lastName: "Lytvyn",
    gender: "female",
    age: 31,
    position: "Project Manager",
    photo: "https://randomuser.me/api/portraits/women/74.jpg",
    hobbies: ["Books", "Travel", "Cooking"],
  },
  {
    firstName: "Volodymyr",
    lastName: "Hrytsenko",
    gender: "male",
    age: 20,
    position: "Student",
    photo: "https://randomuser.me/api/portraits/men/23.jpg",
    hobbies: ["Programming", "Football"],
  },
  {
    firstName: "Sofiia",
    lastName: "Melnyk",
    gender: "female",
    age: 27,
    position: "HR",
    photo: "https://randomuser.me/api/portraits/women/28.jpg",
    hobbies: ["Cooking", "Photography", "Music"],
  },
];

function App() {
  const [filter, setFilter] = useState<"all" | "male" | "female">("all");

  const filteredUsers =
      filter === "all" ? usersData : usersData.filter((u) => u.gender === filter);

  return (
      <div style={{ padding: "20px" }}>
        <h1 style={{ textAlign: "center" }}>Users App</h1>

        {/* Toolbar */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("male")} style={{ margin: "0 10px" }}>
            Male
          </button>
          <button onClick={() => setFilter("female")}>Female</button>
        </div>

        {/* Users List */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
          {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => <UserCard key={index} user={user} />)
          ) : (
              <p>Список юзерів пустий</p>
          )}
        </div>
      </div>
  );
}

export default App;
