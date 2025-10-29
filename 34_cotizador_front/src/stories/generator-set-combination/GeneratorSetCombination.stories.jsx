import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GeneratorSetCombination } from "../../modules/operaciones/cotizaciones/components/v2/GeneratorSetCombination";
import {
  generatorSetCombinationCabinOpenMook,
  generatorSetCombinationCabinSoundProfMook,
} from "./mook";

const queryClient = new QueryClient();

const meta = {
  component: GeneratorSetCombination,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>{Story()}</QueryClientProvider>
    ),
  ],
};

export default meta;

export const CabinOpen = {
  args: {
    generatorSet: generatorSetCombinationCabinOpenMook,
    options: {
      isAdded: false,
      isEditMode: false,
    },
  },
  render: (args) => (
    <div className="max-w-md mx-auto p-4">
      <GeneratorSetCombination {...args} />
    </div>
  ),
};
export const CabinSoundproof = {
  args: {
    generatorSet: generatorSetCombinationCabinSoundProfMook,
    options: {
      isAdded: false,
      isEditMode: false,
    },
  },
  render: (args) => (
    <div className="mx-auto p-4">
      <GeneratorSetCombination {...args} />
    </div>
  ),
};
