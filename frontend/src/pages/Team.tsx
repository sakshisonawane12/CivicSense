import { Users } from "lucide-react";

export default function Team() {
  const teamMembers = [
    { name: "Shreya Phalke", role: "Developer" },
    { name: "Sanika Mohite", role: "Developer" },
    { name: "Sakshi Sonawane", role: "Developer" },
    { name: "Srushti Mane", role: "Developer" },
  ];

  return (
    <div className="team-page">
      <div className="team-header">
        <Users size={48} color="#3b82f6" />
        <h1>Team Localhost</h1>
        <p className="team-subtitle">Meet the team behind CIVICSENSE</p>
      </div>

      <div className="team-grid">
        {teamMembers.map((member, index) => (
          <div key={index} className="team-member-card">
            <div className="member-avatar">
              {member.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <h3>{member.name}</h3>
            <p className="member-role">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
