
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const genreData = [
  { name: "Rock", value: 35 },
  { name: "Pop", value: 25 },
  { name: "Hip Hop", value: 15 },
  { name: "Eletrônica", value: 10 },
  { name: "Indie", value: 15 },
];

const artistData = [
  { name: "The Weeknd", songs: 18 },
  { name: "Dua Lipa", songs: 14 },
  { name: "Arctic Monkeys", songs: 12 },
  { name: "Billie Eilish", songs: 10 },
  { name: "Post Malone", songs: 8 },
];

const tracksData = [
  { name: "Blinding Lights", plays: 22 },
  { name: "Save Your Tears", plays: 18 },
  { name: "Levitating", plays: 15 },
  { name: "Bad Guy", plays: 12 },
  { name: "505", plays: 10 },
];

const COLORS = ["#8B5CF6", "#D946EF", "#0EA5E9", "#F87171", "#6366F1"];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border bg-background p-2 shadow-sm">
        <p className="font-medium">{`${payload[0].name}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export function MusicStats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Estatísticas dos Últimos 30 Dias</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="genres">
        <TabsList className="grid w-full grid-cols-3 rounded-full bg-background hover:text-accent-foreground ">
          <TabsTrigger value="genres" className="rounded-full bg-background hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">Gêneros</TabsTrigger>
          <TabsTrigger value="artists" className="rounded-full bg-background hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">Artistas</TabsTrigger>
          <TabsTrigger value="tracks" className="rounded-full bg-background hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">Faixas</TabsTrigger>
        </TabsList>
          
          <TabsContent value="genres" className="mt-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genreData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {genreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="artists" className="mt-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={artistData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 40,
                    bottom: 5,
                  }}
                >
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    scale="band" 
                    tick={{ fontSize: 12 }} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="songs" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="tracks" className="mt-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={tracksData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 40,
                    bottom: 5,
                  }}
                >
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    scale="band" 
                    tick={{ fontSize: 12 }} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="plays" fill="#D946EF" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
