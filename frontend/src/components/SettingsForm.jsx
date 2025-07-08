import React, { useState } from "react";
import styled from "@emotion/styled";
import Button from "./common/Button";
import api from "../services/api";
import { useEffect } from "react";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #94a3b8;
  font-size: 0.95rem;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 1rem;
  border-radius: 1rem;
  border: 2px solid rgba(148, 163, 184, 0.2);
  background: rgba(15, 23, 42, 0.5);
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box;
  min-height: 3rem;

  &:focus {
    border-color: #06b6d4;
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
  }

  &::placeholder {
    color: #64748b;
  }
`;

function SettingsForm({ user, onSave }) {
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
    bio: user?.bio || "",
    password: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Always fetch the latest user data when the form mounts or user changes
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me");
        const u = response.data.data.user;
        setFormData({
          username: u.username || "",
          email: u.email || "",
          avatar: u.avatar || "",
          bio: u.bio || "",
          password: "",
        });
      } catch (error) {
        // fallback to passed user
        setFormData({
          username: user?.username || "",
          email: user?.email || "",
          avatar: user?.avatar || "",
          bio: user?.bio || "",
          password: "",
        });
      }
    };
    fetchUser();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(formData);
    // Refresh user data after save
    const response = await api.get("/auth/me");
    const u = response.data.data.user;
    setFormData({
      username: u.username || "",
      email: u.email || "",
      avatar: u.avatar || "",
      bio: u.bio || "",
      password: "",
    });
    setSaving(false);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="avatar">Avatar URL</Label>
        <Input
          id="avatar"
          name="avatar"
          value={formData.avatar}
          onChange={handleChange}
          placeholder="Paste image URL or leave blank"
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="bio">Bio</Label>
        <Input
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself"
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="password">New Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Leave blank to keep current password"
        />
      </FormGroup>
      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </Form>
  );
}

export default SettingsForm;
