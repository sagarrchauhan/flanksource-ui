import { ComponentMeta, ComponentStory } from "@storybook/react";
import {
  HypothesisNodeType,
  HypothesisStatus
} from "../../../api/services/hypothesis";
import { HypothesisBar } from "./index";

export default {
  title: "HypothesisBar",
  component: HypothesisBar,
  parameters: { actions: { argTypesRegex: "^on.*" } }
} as ComponentMeta<typeof HypothesisBar>;

const Template: ComponentStory<typeof HypothesisBar> = (arg: any) => (
  <HypothesisBar {...arg} />
);

export const Basic = Template.bind({});

Basic.args = {
  hypothesis: {
    id: "h-123",
    incident_id: "i-1232",
    title: "Test Hypothesis",
    status: HypothesisStatus.Proven,
    type: HypothesisNodeType.Root,
    created_by: {
      id: "124",
      name: "Galileo Galilei",
      email: "galilei@flanksource.com",
      avatar: "https://i.pravatar.cc/300"
    },
    comment: [
      {
        id: "c-123",
        created_by: {
          id: "456",
          name: "Issac Newton",
          email: "issac@flanksource.com",
          avatar: "https://i.pravatar.cc/301"
        }
      }
    ]
  },
  onTitleClick: () => {}
};
