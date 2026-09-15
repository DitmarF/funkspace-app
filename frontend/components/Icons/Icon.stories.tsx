import type { Meta, StoryObj } from "@storybook/react";
import { Icon, iconNames } from "./Icon";
import styles from "./IconGallery.module.css";

const meta = {
  title: "Icons/Library",
  component: Icon,
  tags: ["autodocs"],
  args: { name: "arrow-down", size: 48 },
  argTypes: {
    name: { control: "select", options: iconNames },
    size: { control: "select", options: [24, 36, 48] },
  },
} satisfies Meta<typeof Icon>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Gallery: Story = {
  render: () => (
    <div className={styles.gallery}>
      {([48, 36, 24] as const).map((size) => (
        <section key={size} aria-label={`${size}px icons`}>
          <h2 className={styles.heading}>{size}px</h2>
          <ul className={styles.icons}>
            {iconNames.map((name) => (
              <li key={name} className={styles.item}>
                <span className={styles.artwork}>
                  <Icon name={name} size={size} />
                </span>
                <span>{name.replaceAll("-", " ")}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  ),
};

export const Playground: Story = {
  render: (args) => (
    <Icon {...args} label={args.label ?? args.name.replaceAll("-", " ")} />
  ),
};

export const Accent: Story = {
  args: {
    name: "settings-burger",
    label: "Settings",
    className: "text-fs-action-primary",
  },
};
