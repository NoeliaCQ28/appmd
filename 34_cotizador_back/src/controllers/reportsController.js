import * as XLSX from "xlsx";
import AuditModel, { AuditActions } from "#models/AuditModel.js";
import ReportsModel from "#models/reportsModel.js";

const ReportsController = {
  getCardResume: async (_, res) => {
    const response = await ReportsModel.getCardResume();
    res.status(response.code).send(response);
  },
  getExecutiveReport: async (req, res) => {
    const filters = {
      typeOfQuoteId: req.query.typeOfQuoteId,
      marketId: req.query.marketId,
      executiveId: req.query.executiveId,
    };

    const response = await ReportsModel.getExecutiveReport(filters);
    res.status(response.code).send(response);
  },
  getQuoteReport: async (req, res) => {
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      typeOfQuoteId: req.query.typeOfQuoteId,
      marketId: req.query.marketId,
      quoteState: req.query.quoteState,
    };

    const response = await ReportsModel.getQuoteReport(filters);
    res.status(response.code).send(response);
  },
  getCustomerReport: async (req, res) => {
    const filters = {
      source: req.query.source,
      industry: req.query.industry,
    };

    const response = await ReportsModel.getCustomerReport(filters);
    res.status(response.code).send(response);
  },
  exportExecutiveReportToExcel: async (req, res) => {
    try {
      const filters = {
        typeOfQuoteId: req.query.typeOfQuoteId,
        marketId: req.query.marketId,
        executiveId: req.query.executiveId,
      };

      const ctx = req.ctx;

      const response = await ReportsModel.getExecutiveReport(filters);

      if (!response.success) {
        return res.status(response.code).send(response);
      }

      // Prepare data for Excel with Spanish headers
      const excelData = response.data.map((item) => ({
        Ejecutivo: item.EjecutivoNombre,
        "Total de Cotizaciones": item.TotalDeCotizaciones,
        "Tipo de Cotización": item.TipoCotizacion,
        Mercado: item.Mercado,
        País: item.Pais,
        "Total Acumulado USD": item.TotalAcumuladoUSD,
      }));

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Set column widths for better readability
      worksheet["!cols"] = [
        { wch: 20 }, // Total de Cotizaciones
        { wch: 30 }, // Ejecutivo
        { wch: 25 }, // Tipo de Cotización
        { wch: 15 }, // Mercado
        { wch: 15 }, // País
        { wch: 20 }, // Total Acumulado USD
      ];

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte Ejecutivos");

      // Generate buffer
      const excelBuffer = XLSX.write(workbook, {
        type: "buffer",
        bookType: "xlsx",
      });

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `Reporte_Ejecutivos_${timestamp}.xlsx`;

      // Set headers for file download
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`,
      );

      await AuditModel.log({
        ctx,
        action: AuditActions.EXPORT,
        humanDescription: `El usuario ${ctx.user.name} exportó el reporte de ejecutivos a Excel`,
        entity: "report",
        entityId: null,
      });

      // Send the Excel file
      res.send(excelBuffer);
    } catch (error) {
      const { message } = error;
      res.status(500).send({
        data: null,
        message: `Error al exportar reporte: ${message}`,
        success: false,
        code: 500,
      });
    }
  },
  exportQuoteReportToExcel: async (req, res) => {
    try {
      const filters = {
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        typeOfQuoteId: req.query.typeOfQuoteId,
        marketId: req.query.marketId,
        quoteState: req.query.quoteState,
      };

      const ctx = req.ctx;

      const response = await ReportsModel.getQuoteReport(filters);

      if (!response.success) {
        return res.status(response.code).send(response);
      }

      // Prepare data for Excel with Spanish headers
      const excelData = response.data.map((item) => ({
        "Numero De Cotizacion": item.NumeroDeCotizacion,
        "Tipo de Cotización": item.TipoDeCotizacion,
        Mercado: item.TipoDeMercado,
        "Fecha de Borrador": item.FechaYHoraBorrador,
        "Fecha de Emisión": item.FechaYHoraEmision,
        "Fecha de Pedido": item.FechaYHoraPedido,
        "Dias de respuesta": item.DiasDeRespuesta,
      }));

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Set column widths for better readability
      worksheet["!cols"] = [
        { wch: 25 }, // Numero De Cotizacion
        { wch: 25 }, // Tipo de Cotización
        { wch: 25 }, // Mercado
        { wch: 25 }, // Fecha de Borrador
        { wch: 25 }, // Fecha de Emisión
        { wch: 25 }, // Fecha de Pedido
        { wch: 25 }, // Dias de respuesta
      ];

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Reporte de Cotizaciones",
      );

      // Generate buffer
      const excelBuffer = XLSX.write(workbook, {
        type: "buffer",
        bookType: "xlsx",
      });

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `Reporte_Cotizaciones_${timestamp}.xlsx`;

      // Set headers for file download
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`,
      );

      await AuditModel.log({
        ctx,
        action: AuditActions.EXPORT,
        humanDescription: `El usuario ${ctx.user.name} exportó el reporte de cotizaciones a Excel`,
        entity: "report",
        entityId: null,
      });

      // Send the Excel file
      res.send(excelBuffer);
    } catch (error) {
      const { message } = error;
      res.status(500).send({
        data: null,
        message: `Error al exportar reporte: ${message}`,
        success: false,
        code: 500,
      });
    }
  },
  exportCustomerReportToExcel: async (req, res) => {
    try {
      const filters = {
        source: req.query.source,
        industry: req.query.industry,
      };

      const ctx = req.ctx;

      const response = await ReportsModel.getCustomerReport(filters);

      if (!response.success) {
        return res.status(response.code).send(response);
      }

      // Prepare data for Excel with Spanish headers
      const excelData = response.data.map((item) => ({
        Cliente: item.ClienteNombre,
        Procedencia: item.Procedencia,
        Rubro: item.Rubro,
        "N° de contactos": item.CantidadContactos,
        "N° de cotizaciones borrador": item.CantidadCotizacionesBorrador,
        "N° de cotizaciones emitidas": item.CantidadCotizacionesEmitidas,
        "N° de cotizaciones en pedido": item.CantidadCotizacionesAPedido,
      }));

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Set column widths for better readability
      worksheet["!cols"] = [
        { wch: 30 }, // Cliente
        { wch: 20 }, // Procedencia
        { wch: 20 }, // Rubro
        { wch: 15 }, // N° de contactos
        { wch: 25 }, // N° de cotizaciones borrador
        { wch: 25 }, // N° de cotizaciones emitidas
        { wch: 25 }, // N° de cotizaciones en pedido
      ];

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Reporte de Clientes",
      );

      // Generate buffer
      const excelBuffer = XLSX.write(workbook, {
        type: "buffer",
        bookType: "xlsx",
      });

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `Reporte_Clientes_${timestamp}.xlsx`;

      // Set headers for file download
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`,
      );

      await AuditModel.log({
        ctx,
        action: AuditActions.EXPORT,
        humanDescription: `El usuario ${ctx.user.name} exportó el reporte de clientes a Excel`,
        entity: "report",
        entityId: null,
      });

      // Send the Excel file
      res.send(excelBuffer);
    } catch (error) {
      const { message } = error;

      await AuditModel.log({
        ctx,
        action: AuditActions.EXPORT,
        humanDescription: `El usuario ${ctx.user.name} intento exportar el reporte de clientes a Excel, pero falló con el error: ${message}`,
        entity: "report",
        entityId: null,
        success: false,
        error: message,
      });

      res.status(500).send({
        data: null,
        message: `Error al exportar reporte: ${message}`,
        success: false,
        code: 500,
      });
    }
  },
};

export default ReportsController;
