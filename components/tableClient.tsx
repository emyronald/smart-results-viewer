import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateGradeDistribution } from "@/lib/calculateDistribution";

export default function GradeDistributionTable({ results }: { results: any[] }) {
  const data = calculateGradeDistribution(results);

  return (
    <Card className="w-full max-w-md black-bg text-white border-gray-600 m-auto">
      <CardHeader>
        <CardTitle>Grade Distribution Summary</CardTitle>
      </CardHeader>
      
      <div className="p-4 pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px] text-white">Grade</TableHead>
              <TableHead className="text-white">Range</TableHead>
              <TableHead className="text-right text-white">Frequency</TableHead>
              <TableHead className="text-right text-white">Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.grade}>
                {/* The Grade Letter (Colored) */}
                <TableCell className={`font-bold ${row.color}`}>
                  {row.grade}
                </TableCell>
                
                {/* The Score Range */}
                <TableCell className="text-muted-foreground">
                  {row.range}
                </TableCell>
                
                {/* Frequency Count */}
                <TableCell className="text-right font-medium">
                  {row.count}
                </TableCell>
                
                {/* Percentage */}
                <TableCell className="text-right text-muted-foreground">
                  {row.percentage}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}