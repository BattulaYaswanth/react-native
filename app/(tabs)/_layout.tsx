import { NativeTabs, Label, Icon } from 'expo-router/unstable-native-tabs';
import {useColorScheme} from "nativewind";

export default function TabLayout() {
    const {colorScheme} = useColorScheme();
    const isDark = colorScheme === 'dark';
    const tintColor = isDark ? 'hsl(142 70% 54%)' :
        'hsl(147 75% 33%)';
    return (
        <NativeTabs tintColor={tintColor}>
            <NativeTabs.Trigger name="index">
                <Label>List</Label>
                <Icon
                    sf={{ default: "list.bullet.clipboard", selected: "list.bullet.clipboard.fill" }}
                    drawable="ic_menu_view" // Correct type property for SDK 54
                />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="planner">
                <Label>Planner</Label>
                <Icon
                    sf={{ default: "plus.circle", selected: "plus.circle.fill" }}
                    drawable="ic_menu_agenda"
                />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="insights">
                <Label>Insights</Label>
                <Icon
                    sf={{ default: "chart.bar", selected: "chart.bar.fill" }}
                    drawable="ic_menu_manage"
                />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}
